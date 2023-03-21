import Head from "next/head";
import styles from "@/styles/Home.module.css";
import Game from "@/components/Game";

export default function Home() {
  return (
    <>
      <Head>
        <title>Site</title>
      </Head>
      <main className={styles.main}>
        <Game />
      </main>
    </>
  );
}
