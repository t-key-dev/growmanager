import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';

export default function VoiceNotesPage() {
  const plants = useLiveQuery(() => db.plants.toArray(), []);
  const notes = useLiveQuery(() => db.voiceNotes.toArray(), []);
  
  const [selectedPlantId, setSelectedPlantId] = useState<number | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = async () => {
          await db.voiceNotes.add({
            plantId: selectedPlantId!,
            audioData: reader.result as string,
            duration: recordingTime,
            createdAt: new Date().toISOString(),
          });
          setRecordingTime(0);
        };
        reader.readAsDataURL(blob);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);

      // Timer starten
      const timer = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      recorder.onstop = () => clearInterval(timer);
    } catch (error) {
      alert('Mikrofon-Zugriff nicht möglich');
      console.error(error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  const deleteNote = async (id: number) => {
    if (confirm('Sprachnotiz wirklich löschen?')) {
      await db.voiceNotes.delete(id);
    }
  };

  const playNote = (audioData: string) => {
    const audio = new Audio(audioData);
    audio.play();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const plantNotes = notes?.filter(n => n.plantId === selectedPlantId) || [];

  return (
    <div className="page">
      <h1>🎤 Voice Notes</h1>
      <p className="subtitle">Sprachnotizen statt Text bei Logs</p>

      <div className="card">
        <h3>Pflanze auswählen</h3>
        <select
          value={selectedPlantId || ''}
          onChange={e => setSelectedPlantId(e.target.value ? Number(e.target.value) : null)}
        >
          <option value="">Bitte wählen...</option>
          {plants?.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {selectedPlantId && (
        <>
          <div className="card">
            <h3>Neue Sprachnotiz</h3>
            <div className="voice-recorder">
              {isRecording ? (
                <>
                  <div className="recording-indicator">
                    <div className="recording-dot"></div>
                    <span>Aufnahme: {formatTime(recordingTime)}</span>
                  </div>
                  <button className="btn btn-danger" onClick={stopRecording}>
                    ⏹️ Stoppen
                  </button>
                </>
              ) : (
                <button className="btn btn-primary" onClick={startRecording}>
                  🎤 Aufnahme starten
                </button>
              )}
            </div>
          </div>

          <div className="card">
            <h3>Sprachnotizen ({plantNotes.length})</h3>
            {plantNotes.length > 0 ? (
              <div className="voice-notes-list">
                {plantNotes.map(note => (
                  <div key={note.id} className="voice-note-item">
                    <div className="voice-note-header">
                      <span className="voice-note-date">
                        {new Date(note.createdAt).toLocaleString('de-DE')}
                      </span>
                      <span className="voice-note-duration">
                        {formatTime(note.duration)}
                      </span>
                    </div>
                    <div className="voice-note-actions">
                      <button 
                        className="btn-icon" 
                        onClick={() => playNote(note.audioData)}
                        title="Abspielen"
                      >
                        ▶️
                      </button>
                      <button 
                        className="btn-icon danger" 
                        onClick={() => deleteNote(note.id!)}
                        title="Löschen"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>Keine Sprachnotizen vorhanden</p>
              </div>
            )}
          </div>
        </>
      )}

      <div className="card">
        <h3>💡 Tipp</h3>
        <p>
          Sprachnotizen sind perfekt für schnelle Beobachtungen während der Pflege. 
          Du kannst später in Ruhe transkribieren oder die Notizen anhören.
        </p>
      </div>
    </div>
  );
}
