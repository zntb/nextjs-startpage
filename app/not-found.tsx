import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.code}>404</h1>
        <div className={styles.divider} />
        <p className={styles.message}>This page could not be found.</p>
        <Link href="/" className={styles.link}>
          Back to home
        </Link>
      </div>
    </div>
  );
}
