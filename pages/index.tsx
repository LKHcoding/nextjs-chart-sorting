import Head from "next/head";
import styles from "../styles/Home.module.css";
import Insert from "../components/InsertionSort";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Visualized Sort Algorithm</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Visualized Sort <a href="https://github.com/LKHcoding">Algorithm</a>
        </h1>

        
      </main>
        <Insert />
    </div>
  );
}
