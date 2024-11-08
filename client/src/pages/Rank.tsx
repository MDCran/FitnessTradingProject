import PageWrapper from "src/components/PageWrapper";

const Rank = () => (
  <PageWrapper title="Rank">
    <p className="tc f4 fw4 w-70">
      Testing for leaderboard
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
        <tbody color="purple">
          <tr>
            <td color="gray">1</td>
            <td color="gray">2</td>
            <td color="gray">3</td>
          </tr>
          <tr>
            <td color="gray">2</td>
            <td color="gray">3</td>
            <td color="gray">4</td>
          </tr>
          <tr>
            <td color="gray">3</td>
            <td color="gray">4</td>
            <td color="gray">5</td>
          </tr>
        </tbody>
      </table>
    </div>


  </PageWrapper>
);

export default Rank;
