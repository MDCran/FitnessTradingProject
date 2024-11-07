import PageWrapper from "src/components/PageWrapper";

const Rank = () => (
  <PageWrapper title="Rank">
    <p className="tc f4 fw4 w-70">
      You can search for <code>skeleton</code> in your editor to find all places
      where you should make your own changes. Check out the{" "}
      <code>README.md</code> for more info.
    </p>


    <div>
      <table>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Gender</th>
          </tr>
            <tr>
              <td>1</td>
              <td>2</td>
              <td>3</td>
            </tr>
        </table>
    </div>


  </PageWrapper>
);

export default Rank;
