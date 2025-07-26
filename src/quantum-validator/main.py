"""
Quantum Randomness Validation Service

This service uses IBM Quantum computers via Qiskit to validate the randomness quality
of ICP's raw_rand() system API. It generates quantum random numbers and performs
statistical comparisons to prove that ICP's consensus-based randomness meets
quantum-level standards.

Author: ICP VRN Generator Team
Purpose: Hackathon demonstration of ICP's unique randomness capabilities
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
import numpy as np
import uuid
import asyncio
from datetime import datetime
import json

# Qiskit imports
from qiskit import QuantumCircuit, transpile
from qiskit_ibm_runtime import QiskitRuntimeService, Sampler
from qiskit_aer import AerSimulator
from qiskit.providers.fake_provider import FakeManila

# Statistical analysis imports
from scipy import stats
import pandas as pd

app = FastAPI(
    title="ICP Quantum Randomness Validator",
    description="Validate ICP randomness using IBM Quantum computers",
    version="1.0.0"
)

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class RandomNumberBatch(BaseModel):
    numbers: List[int]
    source: str = "icp"
    timestamp: str = None

class ValidationRequest(BaseModel):
    icp_numbers: List[int]
    quantum_sample_size: int = 1000
    use_real_quantum: bool = False

class ValidationResult(BaseModel):
    job_id: str
    status: str  # "pending", "running", "completed", "failed"
    icp_stats: Optional[Dict] = None
    quantum_stats: Optional[Dict] = None
    comparison_results: Optional[Dict] = None
    p_values: Optional[Dict] = None
    is_random: Optional[bool] = None
    created_at: str
    completed_at: Optional[str] = None

# In-memory storage for validation jobs (in production, use Redis or database)
validation_jobs: Dict[str, ValidationResult] = {}

class QuantumRandomGenerator:
    """Generate quantum random numbers using IBM Quantum or simulator"""
    
    def __init__(self):
        self.service = None
        self.simulator = AerSimulator()
        
    async def initialize_ibm_quantum(self, token: str = None):
        """Initialize IBM Quantum service (requires API token)"""
        try:
            if token:
                self.service = QiskitRuntimeService(channel="ibm_quantum", token=token)
            else:
                # Try to use saved credentials
                self.service = QiskitRuntimeService()
            return True
        except Exception as e:
            print(f"IBM Quantum initialization failed: {e}")
            return False
    
    def create_quantum_random_circuit(self, num_qubits: int = 8) -> QuantumCircuit:
        """Create quantum circuit for random number generation"""
        qc = QuantumCircuit(num_qubits, num_qubits)
        
        # Apply Hadamard gates to create superposition
        for i in range(num_qubits):
            qc.h(i)
        
        # Measure all qubits
        qc.measure_all()
        
        return qc
    
    async def generate_quantum_random_bits(self, count: int, use_real_quantum: bool = False) -> List[int]:
        """Generate quantum random bits"""
        try:
            num_qubits = 8  # Generate 8 bits at a time
            circuits_needed = (count + num_qubits - 1) // num_qubits
            
            all_bits = []
            
            for _ in range(circuits_needed):
                qc = self.create_quantum_random_circuit(num_qubits)
                
                if use_real_quantum and self.service:
                    # Use real IBM Quantum hardware
                    backend = self.service.least_busy(operational=True, simulator=False)
                    sampler = Sampler(backend)
                    job = sampler.run([qc], shots=1)
                    result = job.result()
                    
                    # Extract bits from measurement result
                    bitstring = list(result.quasi_dists[0].keys())[0]
                    bits = [int(b) for b in format(bitstring, f'0{num_qubits}b')]
                else:
                    # Use simulator (faster for development/demo)
                    backend = self.simulator
                    transpiled_qc = transpile(qc, backend)
                    job = backend.run(transpiled_qc, shots=1)
                    result = job.result()
                    
                    # Extract bits from measurement result
                    counts = result.get_counts()
                    bitstring = list(counts.keys())[0]
                    bits = [int(b) for b in bitstring[::-1]]  # Reverse for correct order
                
                all_bits.extend(bits)
            
            return all_bits[:count]  # Return exactly the requested count
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Quantum random generation failed: {e}")
    
    async def generate_quantum_integers(self, count: int, bit_size: int = 64, use_real_quantum: bool = False) -> List[int]:
        """Generate quantum random integers from quantum bits"""
        total_bits_needed = count * bit_size
        quantum_bits = await self.generate_quantum_random_bits(total_bits_needed, use_real_quantum)
        
        integers = []
        for i in range(count):
            bit_chunk = quantum_bits[i * bit_size:(i + 1) * bit_size]
            # Convert binary bits to integer
            integer_value = sum(bit * (2 ** idx) for idx, bit in enumerate(bit_chunk))
            integers.append(integer_value)
        
        return integers

class StatisticalAnalyzer:
    """Perform statistical analysis on random number sequences"""
    
    @staticmethod
    def frequency_test(sequence: List[int]) -> float:
        """NIST Frequency (Monobit) Test"""
        n = len(sequence)
        if n == 0:
            return 0.0
        
        # Convert to binary string
        binary_str = ''.join([format(num, '064b') for num in sequence])
        
        # Count ones and zeros
        ones = binary_str.count('1')
        zeros = len(binary_str) - ones
        
        # Calculate test statistic
        s_obs = abs(ones - zeros) / np.sqrt(len(binary_str))
        
        # Calculate p-value
        p_value = stats.norm.sf(s_obs) * 2  # Two-tailed test
        
        return p_value
    
    @staticmethod
    def runs_test(sequence: List[int]) -> float:
        """NIST Runs Test"""
        # Convert to binary string
        binary_str = ''.join([format(num, '064b') for num in sequence])
        n = len(binary_str)
        
        if n == 0:
            return 0.0
        
        # Count ones
        ones = binary_str.count('1')
        pi = ones / n
        
        # Pre-test: frequency must be approximately 0.5
        if abs(pi - 0.5) >= 2 / np.sqrt(n):
            return 0.0
        
        # Count runs
        runs = 1
        for i in range(1, n):
            if binary_str[i] != binary_str[i-1]:
                runs += 1
        
        # Calculate test statistic
        expected_runs = 2 * n * pi * (1 - pi) + 1
        variance = 2 * n * pi * (1 - pi) * (2 * n * pi * (1 - pi) - 1)
        
        if variance == 0:
            return 0.0
        
        z = (runs - expected_runs) / np.sqrt(variance)
        p_value = stats.norm.sf(abs(z)) * 2  # Two-tailed test
        
        return p_value
    
    @staticmethod
    def uniformity_test(sequence: List[int]) -> float:
        """Chi-square uniformity test"""
        if len(sequence) < 10:
            return 0.0
        
        # Normalize to [0, 1) range
        max_val = max(sequence)
        if max_val == 0:
            return 0.0
        
        normalized = [x / (max_val + 1) for x in sequence]
        
        # Create bins for chi-square test
        num_bins = min(10, len(sequence) // 5)
        observed, _ = np.histogram(normalized, bins=num_bins, range=(0, 1))
        expected = [len(sequence) / num_bins] * num_bins
        
        # Chi-square test
        chi_stat, p_value = stats.chisquare(observed, expected)
        
        return p_value
    
    @staticmethod
    def kolmogorov_smirnov_test(sequence1: List[int], sequence2: List[int]) -> float:
        """Two-sample Kolmogorov-Smirnov test"""
        if len(sequence1) == 0 or len(sequence2) == 0:
            return 0.0
        
        # Normalize sequences
        max1, max2 = max(sequence1), max(sequence2)
        if max1 == 0 or max2 == 0:
            return 0.0
        
        norm1 = [x / max1 for x in sequence1]
        norm2 = [x / max2 for x in sequence2]
        
        # Perform KS test
        statistic, p_value = stats.ks_2samp(norm1, norm2)
        
        return p_value
    
    @staticmethod
    def analyze_sequence(sequence: List[int], name: str = "Unknown") -> Dict:
        """Comprehensive statistical analysis of a random sequence"""
        if not sequence:
            return {"error": "Empty sequence"}
        
        analyzer = StatisticalAnalyzer()
        
        results = {
            "name": name,
            "count": len(sequence),
            "min": min(sequence),
            "max": max(sequence),
            "mean": np.mean(sequence),
            "std": np.std(sequence),
            "frequency_test_p": analyzer.frequency_test(sequence),
            "runs_test_p": analyzer.runs_test(sequence),
            "uniformity_test_p": analyzer.uniformity_test(sequence),
        }
        
        # Determine if sequence passes randomness tests (p > 0.01)
        critical_p = 0.01
        results["passes_frequency"] = results["frequency_test_p"] > critical_p
        results["passes_runs"] = results["runs_test_p"] > critical_p
        results["passes_uniformity"] = results["uniformity_test_p"] > critical_p
        results["overall_random"] = all([
            results["passes_frequency"],
            results["passes_runs"], 
            results["passes_uniformity"]
        ])
        
        return results

# Initialize quantum generator
quantum_gen = QuantumRandomGenerator()
analyzer = StatisticalAnalyzer()

@app.on_event("startup")
async def startup_event():
    """Initialize quantum service on startup"""
    # Try to initialize IBM Quantum (will fail gracefully if no token)
    await quantum_gen.initialize_ibm_quantum()

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "service": "ICP Quantum Randomness Validator",
        "status": "running",
        "quantum_available": quantum_gen.service is not None,
        "timestamp": datetime.now().isoformat()
    }

@app.post("/generate-quantum-random")
async def generate_quantum_random(count: int = 100, use_real_quantum: bool = False):
    """Generate quantum random numbers"""
    try:
        if count > 10000:
            raise HTTPException(status_code=400, detail="Count too large (max 10000)")
        
        numbers = await quantum_gen.generate_quantum_integers(count, use_real_quantum=use_real_quantum)
        
        return {
            "numbers": numbers,
            "count": len(numbers),
            "source": "quantum_real" if use_real_quantum else "quantum_simulator",
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/validate-randomness")
async def validate_randomness(request: ValidationRequest, background_tasks: BackgroundTasks):
    """Start randomness validation job"""
    job_id = str(uuid.uuid4())
    
    # Create validation job
    validation_job = ValidationResult(
        job_id=job_id,
        status="pending",
        created_at=datetime.now().isoformat()
    )
    validation_jobs[job_id] = validation_job
    
    # Start background validation
    background_tasks.add_task(run_validation, job_id, request)
    
    return {"job_id": job_id, "status": "started"}

async def run_validation(job_id: str, request: ValidationRequest):
    """Run the actual validation in background"""
    try:
        job = validation_jobs[job_id]
        job.status = "running"
        
        # Analyze ICP numbers
        icp_stats = analyzer.analyze_sequence(request.icp_numbers, "ICP raw_rand")
        job.icp_stats = icp_stats
        
        # Generate quantum random numbers
        quantum_numbers = await quantum_gen.generate_quantum_integers(
            request.quantum_sample_size, 
            use_real_quantum=request.use_real_quantum
        )
        
        # Analyze quantum numbers  
        quantum_stats = analyzer.analyze_sequence(quantum_numbers, "Quantum")
        job.quantum_stats = quantum_stats
        
        # Compare the two sequences
        ks_p_value = analyzer.kolmogorov_smirnov_test(request.icp_numbers, quantum_numbers)
        
        comparison_results = {
            "ks_test_p_value": ks_p_value,
            "sequences_similar": ks_p_value > 0.05,  # Not significantly different
            "icp_passes_all_tests": icp_stats.get("overall_random", False),
            "quantum_passes_all_tests": quantum_stats.get("overall_random", False),
        }
        
        job.comparison_results = comparison_results
        job.p_values = {
            "icp_frequency": icp_stats.get("frequency_test_p", 0),
            "icp_runs": icp_stats.get("runs_test_p", 0),
            "icp_uniformity": icp_stats.get("uniformity_test_p", 0),
            "quantum_frequency": quantum_stats.get("frequency_test_p", 0),
            "quantum_runs": quantum_stats.get("runs_test_p", 0),
            "quantum_uniformity": quantum_stats.get("uniformity_test_p", 0),
            "comparison_ks": ks_p_value
        }
        
        # Final determination
        job.is_random = (
            comparison_results["icp_passes_all_tests"] and 
            comparison_results["sequences_similar"]
        )
        
        job.status = "completed"
        job.completed_at = datetime.now().isoformat()
        
    except Exception as e:
        job.status = "failed"
        job.comparison_results = {"error": str(e)}

@app.get("/validation-status/{job_id}")
async def get_validation_status(job_id: str):
    """Get validation job status and results"""
    if job_id not in validation_jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    
    return validation_jobs[job_id]

@app.get("/validation-jobs")
async def list_validation_jobs():
    """List all validation jobs"""
    return list(validation_jobs.values())

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
