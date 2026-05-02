import TopNav from "@/app/components/TopNav";
import FeedFromApi from "@/app/components/FeedFromApi";

export default async function Page() {
  return (
    <>
      <TopNav activePath="/feed" />
      <main className="container">
        <h2>Your News Feed</h2>
        <br />
        <section id="feed-container">
          <FeedFromApi />
        </section>
      </main>
    </>
  );
}
