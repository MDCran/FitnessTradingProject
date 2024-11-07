import PageWrapper from "src/components/PageWrapper";
// // Filename - App.js
import './App.css';

// // Example of a data array that
// // you might receive from an API
const data = [
    { name: "Anom", age: 19, gender: "Male" },
    { name: "Megha", age: 19, gender: "Female" },
    { name: "Subham", age: 25, gender: "Male" },
]


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
