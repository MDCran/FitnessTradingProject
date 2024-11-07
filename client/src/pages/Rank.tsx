import PageWrapper from "src/components/PageWrapper";

const Rank = () => (
  <PageWrapper title="Rank">
    <p className="tc f4 fw4 w-70">
      You can search for <code>skeleton</code> in your editor to find all places
      where you should make your own changes. Check out the{" "}
      <code>README.md</code> for more info.
    </p>


    <div className="app-container">
      <table border={1}>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={2}>1</td>
            <td colSpan={2}>2</td>
            <td colSpan={2}>3</td>
          </tr>
        </tbody>
      </table>
    </div>


  </PageWrapper>
);

export default Rank;
