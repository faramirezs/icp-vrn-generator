#!/usr/bin/env python3

"""
Quick test script for the Quantum Validation Service
"""

import requests
import json
import time

QUANTUM_API = "http://localhost:8000"

def test_quantum_service():
    print("🔬 Testing Quantum Validation Service...")
    
    # Test health check
    try:
        response = requests.get(f"{QUANTUM_API}/")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Service running: {data['service']}")
            print(f"   Quantum available: {data.get('quantum_available', False)}")
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Cannot connect to quantum service: {e}")
        print("   Make sure to start it with: python src/quantum-validator/main.py")
        return False
    
    # Test quantum random generation
    print("\n🎲 Testing quantum random generation...")
    try:
        response = requests.post(
            f"{QUANTUM_API}/generate-quantum-random",
            params={"count": 10, "use_real_quantum": False}
        )
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Generated {len(data['numbers'])} quantum random numbers")
            print(f"   Source: {data['source']}")
            print(f"   Sample: {data['numbers'][:3]}...")
        else:
            print(f"❌ Random generation failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Random generation error: {e}")
        return False
    
    # Test validation with sample data
    print("\n⚛️ Testing randomness validation...")
    sample_icp_numbers = [
        123456789, 987654321, 456789123, 789123456, 321654987,
        147258369, 963852741, 852741963, 741963852, 159357468
    ]
    
    try:
        response = requests.post(
            f"{QUANTUM_API}/validate-randomness",
            json={
                "icp_numbers": sample_icp_numbers,
                "quantum_sample_size": 10,
                "use_real_quantum": False
            }
        )
        if response.status_code == 200:
            data = response.json()
            job_id = data['job_id']
            print(f"✅ Validation job started: {job_id}")
            
            # Poll for results
            print("   Waiting for validation results...")
            for attempt in range(20):  # 20 attempts = 100 seconds max
                time.sleep(5)
                status_response = requests.get(f"{QUANTUM_API}/validation-status/{job_id}")
                if status_response.status_code == 200:
                    status_data = status_response.json()
                    if status_data['status'] == 'completed':
                        print(f"✅ Validation completed!")
                        if status_data.get('is_random'):
                            print("   🎉 Sample data validated as random!")
                        else:
                            print("   ⚠️ Sample data did not pass all tests (expected for non-random sample)")
                        return True
                    elif status_data['status'] == 'failed':
                        print(f"❌ Validation failed")
                        return False
                    else:
                        print(f"   Status: {status_data['status']}")
            
            print("❌ Validation timeout")
            return False
        else:
            print(f"❌ Validation start failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Validation error: {e}")
        return False

if __name__ == "__main__":
    print("🌟 Quantum Validation Service Test")
    print("=" * 50)
    
    success = test_quantum_service()
    
    print("\n" + "=" * 50)
    if success:
        print("✅ All tests passed! Quantum validation service is working correctly.")
        print("\n🚀 Ready for quantum validation of ICP randomness!")
    else:
        print("❌ Some tests failed. Please check the service setup.")
        print("\n📚 Troubleshooting:")
        print("   1. Make sure Python dependencies are installed: pip install -r requirements.txt")
        print("   2. Start the service: python src/quantum-validator/main.py")
        print("   3. Check the service logs for errors")
