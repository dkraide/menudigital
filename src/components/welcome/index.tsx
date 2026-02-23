import styles from './Welcome.module.scss';

export default function Welcome() {
  return (
    <div className={styles.container}>
      <h1>Menu Digital KRD System</h1>
      <p>
        Transforme o atendimento da sua empresa com nosso Menu Digital.
        Simples, rápido e integrado ao seu PDV.
      </p>

      <div className={styles.contato}>
        <a 
          href="https://wa.me/5519971037836" 
          target="_blank"
        >
          Falar no WhatsApp
        </a>

        <a 
          href="https://instagram.com/krdsystem"
          target="_blank"
        >
          Instagram @krdsystem
        </a>
      </div>
    </div>
  );
}