import { useState } from 'react';

export default function PatientForm() {
  const [form, setForm] = useState({
    age: '',
    gender: '',
    chiefComplaint: '',
    symptoms: '',
    medicalHistory: '',
    medications: '',
    lifestyle: '',
    familyHistory: '',
    environment: '',
    otherFactors: '',
    bloodPressure: '',
    heartRate: '',
    respiratoryRate: '',
    temperature: '',
    oxygenSaturation: '',
    additionalNotes: ''
  });

  const [response, setResponse] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
    });
    const data = await res.json();
    setResponse(data);
    setLoading(false);
    };

  return (
    <div className="app-container">
        <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
        <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '40px' }}>
            {/* Intake */}
            <fieldset style={{ flex: 1, padding: '20px' }}>
                <legend><h2>Patient Intake</h2></legend>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '30px', rowGap: '20px' }}>
                <label>Age:<br /><input name="age" type="number" onChange={handleChange} /></label>
                <label>Gender:<br /><input name="gender" onChange={handleChange} /></label>
                <label>Chief Complaint:<br /><textarea name="chiefComplaint" rows="2" onChange={handleChange} /></label>
                <label>Symptoms:<br /><textarea name="symptoms" rows="2" onChange={handleChange} /></label>
                <label>Medical History:<br /><textarea name="medicalHistory" rows="2" onChange={handleChange} /></label>
                <label>Current Medications:<br /><textarea name="medications" rows="2" onChange={handleChange} /></label>
                <label>Lifestyle:<br /><textarea name="lifestyle" rows="2" onChange={handleChange} /></label>
                <label>Family History:<br /><textarea name="familyHistory" rows="2" onChange={handleChange} /></label>
                <label>Environment:<br /><textarea name="environment" rows="2" onChange={handleChange} /></label>
                <label>Other Factors:<br /><textarea name="otherFactors" rows="2" onChange={handleChange} /></label>
                </div>
            </fieldset>

            {/* Physical Exam */}
            <fieldset style={{ flex: 1, padding: '20px' }}>
                <legend><h2>Physical Exam</h2></legend>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '30px', rowGap: '20px'}}>
                <label>Blood Pressure:<br /><input name="bloodPressure" onChange={handleChange} /></label>
                <label>Heart Rate:<br /><input name="heartRate" onChange={handleChange} /></label>
                <label>Respiratory Rate:<br /><input name="respiratoryRate" onChange={handleChange} /></label>
                <label>Temperature (°F):<br /><input name="temperature" onChange={handleChange} /></label>
                <label>Oxygen Saturation (%):<br /><input name="oxygenSaturation" onChange={handleChange} /></label>
                <label>Additional Notes:<br /><textarea name="additionalNotes" rows="2" onChange={handleChange} /></label>
                </div>
                <br />
            </fieldset>
            </div>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <button type="submit" disabled={loading} style={{ padding: '10px 30px', fontSize: '16px' }}>
                    {loading ? 'Processing...' : 'Submit'}
                </button>

            </div>
        </form>

        {response && (
            <div style={{ marginTop: '40px', display: 'grid', gap: '20px', gridTemplateColumns: '1fr 1fr' }}>
            <div style={boxStyle}><h3>Diagnosis Section</h3><div>{response.diagnosis}</div></div>
            <div style={boxStyle}><h3>Treatments and Interventions</h3><div>{response.treatments}</div></div>
            <div style={boxStyle}><h3>General Advice</h3><div>{response.advice}</div></div>
            <div style={boxStyle}><h3>Additional Considerations</h3><div>{response.other}</div></div>
            </div>
        )}
        </div>
    </div>
  );
}

const boxStyle = {
    border: '1px solid var(--border)',
    borderRadius: '10px',
    padding: '20px',
    backgroundColor: 'var(--card-bg)',
    color: 'var(--text)',
    boxShadow: '0 4px 10px var(--shadow)',
    whiteSpace: 'pre-wrap',
    transition: 'all 0.3s ease',
  };
  
