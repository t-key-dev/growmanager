import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';

export default function StrainReviewsPage() {
  const strains = useLiveQuery(() => db.strains.toArray(), []);
  const reviews = useLiveQuery(() => db.strainReviews.toArray(), []);
  
  const [selectedStrainId, setSelectedStrainId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    rating: 5,
    yield: 3,
    difficulty: 3,
    taste: 4,
    effect: 4,
    smell: 4,
    comment: '',
  });

  const selectedStrain = strains?.find(s => s.id === selectedStrainId);
  const strainReviews = reviews?.filter(r => r.strainId === selectedStrainId) || [];

  const resetForm = () => {
    setFormData({
      rating: 5,
      yield: 3,
      difficulty: 3,
      taste: 4,
      effect: 4,
      smell: 4,
      comment: '',
    });
    setShowForm(false);
  };

  const handleSubmit = async () => {
    if (!selectedStrainId) return;

    await db.strainReviews.add({
      strainId: selectedStrainId,
      ...formData,
      createdAt: new Date().toISOString(),
    });

    resetForm();
  };

  const renderStars = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const getAverageRating = () => {
    if (strainReviews.length === 0) return 0;
    return strainReviews.reduce((sum, r) => sum + r.rating, 0) / strainReviews.length;
  };

  return (
    <div className="page">
      <h1>⭐ Strain-Bewertungen</h1>
      <p className="subtitle">Eigene Bewertungen und Reviews speichern</p>

      <div className="card">
        <h3>Strain auswählen</h3>
        <select
          value={selectedStrainId || ''}
          onChange={e => setSelectedStrainId(e.target.value ? Number(e.target.value) : null)}
        >
          <option value="">Bitte wählen...</option>
          {strains?.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      {selectedStrain && (
        <>
          <div className="card">
            <div className="strain-review-header">
              <h3>{selectedStrain.name}</h3>
              <div className="average-rating">
                <span className="stars">{renderStars(Math.round(getAverageRating()))}</span>
                <span className="rating-count">({strainReviews.length} Bewertungen)</span>
              </div>
            </div>
          </div>

          {showForm ? (
            <div className="card">
              <h3>Neue Bewertung</h3>
              
              <div className="form-group">
                <label>Gesamtbewertung: {renderStars(formData.rating)}</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={formData.rating}
                  onChange={e => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label>Ertrag: {renderStars(formData.yield)}</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={formData.yield}
                  onChange={e => setFormData({ ...formData, yield: parseInt(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label>Schwierigkeit: {renderStars(formData.difficulty)}</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={formData.difficulty}
                  onChange={e => setFormData({ ...formData, difficulty: parseInt(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label>Geschmack: {renderStars(formData.taste)}</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={formData.taste}
                  onChange={e => setFormData({ ...formData, taste: parseInt(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label>Wirkung: {renderStars(formData.effect)}</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={formData.effect}
                  onChange={e => setFormData({ ...formData, effect: parseInt(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label>Geruch: {renderStars(formData.smell)}</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={formData.smell}
                  onChange={e => setFormData({ ...formData, smell: parseInt(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label>Kommentar</label>
                <textarea
                  value={formData.comment}
                  onChange={e => setFormData({ ...formData, comment: e.target.value })}
                  rows={4}
                  placeholder="Deine Erfahrungen mit diesem Strain..."
                />
              </div>

              <div className="button-group">
                <button className="btn btn-primary" onClick={handleSubmit}>
                  Bewertung speichern
                </button>
                <button className="btn btn-secondary" onClick={resetForm}>
                  Abbrechen
                </button>
              </div>
            </div>
          ) : (
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              + Bewertung hinzufügen
            </button>
          )}

          <div className="card">
            <h3>Alle Bewertungen ({strainReviews.length})</h3>
            {strainReviews.length > 0 ? (
              <div className="reviews-list">
                {strainReviews.map(review => (
                  <div key={review.id} className="review-item">
                    <div className="review-header">
                      <span className="review-stars">{renderStars(review.rating)}</span>
                      <span className="review-date">
                        {new Date(review.createdAt).toLocaleDateString('de-DE')}
                      </span>
                    </div>
                    <div className="review-details">
                      <div className="detail">
                        <span className="label">Ertrag:</span>
                        <span className="value">{renderStars(review.yield)}</span>
                      </div>
                      <div className="detail">
                        <span className="label">Schwierigkeit:</span>
                        <span className="value">{renderStars(review.difficulty)}</span>
                      </div>
                      <div className="detail">
                        <span className="label">Geschmack:</span>
                        <span className="value">{renderStars(review.taste)}</span>
                      </div>
                      <div className="detail">
                        <span className="label">Wirkung:</span>
                        <span className="value">{renderStars(review.effect)}</span>
                      </div>
                      <div className="detail">
                        <span className="label">Geruch:</span>
                        <span className="value">{renderStars(review.smell)}</span>
                      </div>
                    </div>
                    {review.comment && (
                      <div className="review-comment">{review.comment}</div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>Keine Bewertungen vorhanden</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
