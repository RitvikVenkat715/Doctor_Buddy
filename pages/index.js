import Head from 'next/head';
import PatientForm from '../components/PatientForm';
import '../styles/theme.css';


export default function Home() {
  return (
    <>
      <Head>
        <title>AI Diagnosis Assistant</title>
      </Head>
      <main>
        <h1>Patient Intake Form</h1>
        <PatientForm />
      </main>
    </>
  );
}
