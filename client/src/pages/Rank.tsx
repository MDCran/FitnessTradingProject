import PageWrapper from "src/components/PageWrapper";


const Rank = () => (
  <PageWrapper title="Rank">
    {/* <p className="tc f4 fw4 w-70">
      LEADERBOARD
      For testing table
    </p> */}
    <div className="App">
    <table>
        <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Gender</th>
        </tr>
        <tr>
            <td>Anom</td>
            <td>19</td>
            <td>Male</td>
        </tr>
        <tr>
            <td>Megha</td>
            <td>19</td>
            <td>Female</td>
        </tr>
        <tr>
            <td>Subham</td>
            <td>25</td>
            <td>Male</td>
        </tr>
    </table>
    </div>

    <p>
      rip
    </p>

  </PageWrapper>
);

export default Rank;
