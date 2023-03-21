import Head from "next/head";
import styles from "@/styles/Home.module.css";
import Game from "@/pages/Game";
import Home1 from "@/components/Fetcher";

export default function Home() {
  return (
    <>
      <Head>
        <title>Site</title>
      </Head>
      <main className={styles.main}>
        <Home1 />
        <Game />
      </main>
    </>
  );
}
