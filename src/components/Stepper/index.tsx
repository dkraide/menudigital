import React from 'react';
import styles from './Stepper.module.scss'; // Importação do SCSS como módulo

// Tipagem das props
interface StepperProps {
  steps: string[];    // Um array de strings, onde cada string é um passo
  currentStep: number; // O passo atual será controlado pelo componente pai
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <div className={styles.container}>
      <div className={styles.stepContainer}>
        {steps.map((step, index) => (
          <div
            key={index}
            className={`${styles.stepWrapper} ${index <= currentStep ? styles.activeStep : ''}`}
          >
            {/* Círculo do passo */}
            <div className={`${styles.circle} ${index <= currentStep ? styles.activeCircle : ''}`}>
              <span className={styles.stepText}>{index + 1}</span>
            </div>
            {/* Nome do passo */}
            <div className={styles.stepLabel}>
              <p>{step}</p>
            </div>
            {index < steps.length - 1 && (
              <div className={styles.line} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const Stepper2: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <div className={styles.container}>
      {steps.map((step, index) => (
        <div
          key={index}
          className={`${styles.stepWrapper} ${index <= currentStep ? styles.activeStep : ''}`}
        >
          <div className={styles.stepCircle}>
            <div className={`${styles.circle} ${index <= currentStep ? styles.activeCircle : ''}`}>
              <span className={styles.stepText}>{index + 1}</span>
            </div>
            <div className={styles.stepLabel}>
              <p>{step}</p>
            </div>
          </div>
          <div hidden={index == steps.length - 1} className={styles.line} />
        </div>
      ))}
    </div>
  );
};

export default Stepper2;
