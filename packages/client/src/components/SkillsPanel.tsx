import React, { useState } from 'react';
import { SkillType, useSkillsStore } from '../store/skillsStore';

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

export function SkillsPanel() {
  const { skills, getNextLevelExperience, getLevelProgress } = useSkillsStore();
  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      <button 
        className="skills-toggle-button"
        onClick={() => setIsVisible(!isVisible)}
      >
        Skills
      </button>

      {isVisible && (
        <div className="skills-panel">
          <div className="skills-header">
            <h3>Skills</h3>
            <button 
              className="close-button"
              onClick={() => setIsVisible(false)}
            >
              ×
            </button>
          </div>
          {Object.entries(skills).map(([skillType, skill]) => {
            const nextLevelXP = getNextLevelExperience(skillType as SkillType);
            const progress = getLevelProgress(skillType as SkillType);
            
            return (
              <div key={skillType} className="skill-row">
                <div className="skill-info">
                  <span className="skill-name">{skillType}</span>
                  <span className="skill-level">Level {skill.level}</span>
                </div>
                <div className="skill-details">
                  <div className="skill-progress">
                    <div 
                      className="skill-progress-bar" 
                      style={{ width: `${progress}%` }} 
                    />
                  </div>
                  <div className="skill-xp">
                    <span>{formatNumber(skill.experience)} XP</span>
                    {skill.level < skill.maxLevel && (
                      <span className="next-level">
                        Next level: {formatNumber(nextLevelXP)} XP
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        .skills-toggle-button {
          position: fixed;
          top: 70px;
          right: 20px;
          padding: 10px 20px;
          background: #2ecc71;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
          z-index: 1000;
        }

        .skills-toggle-button:hover {
          background: #27ae60;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(46, 204, 113, 0.2);
        }

        .skills-panel {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(0, 0, 0, 0.9);
          padding: 20px;
          border-radius: 8px;
          color: white;
          font-family: inherit;
          min-width: 300px;
          border: 1px solid #2ecc71;
          box-shadow: 0 0 20px rgba(46, 204, 113, 0.2);
          z-index: 1000;
        }

        .skills-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 1px solid rgba(46, 204, 113, 0.3);
        }

        .skills-header h3 {
          margin: 0;
          color: #2ecc71;
        }

        .close-button {
          background: none;
          border: none;
          color: #ecf0f1;
          font-size: 24px;
          cursor: pointer;
          padding: 0 5px;
          transition: color 0.2s;
        }

        .close-button:hover {
          color: #2ecc71;
        }

        .skill-row {
          margin: 12px 0;
          padding: 8px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
          transition: background 0.2s;
        }

        .skill-row:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .skill-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .skill-name {
          color: #ecf0f1;
          font-size: 1em;
          font-weight: bold;
        }

        .skill-level {
          color: #2ecc71;
          font-size: 0.9em;
          font-weight: bold;
        }

        .skill-details {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .skill-progress {
          width: 100%;
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          overflow: hidden;
        }

        .skill-progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #2ecc71, #27ae60);
          transition: width 0.3s ease;
        }

        .skill-xp {
          display: flex;
          justify-content: space-between;
          font-size: 0.8em;
          color: #bdc3c7;
        }

        .next-level {
          color: #95a5a6;
        }
      `}</style>
    </>
  );
} 