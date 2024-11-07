import PageWrapper from "src/components/PageWrapper";
import './App.css';

// Example of a data array that
// you might receive from an API
const data = [
  { name: "Anom", age: 19, gender: "Male" },
  { name: "Megha", age: 19, gender: "Female" },
  { name: "Subham", age: 25, gender: "Male" },
]


const Rank = () => (
  <PageWrapper title="Rank">
    {/* <p className="tc f4 fw4 w-70">
      LEADERBOARD
      For testing table
    </p> */}
    <p>
      rip 2
    </p>

  </PageWrapper>
);

// function Rank() {
//   return (
//       <div className="App">
//           <table>
//               <tr>
//                   <th>Name</th>
//                   <th>Age</th>
//                   <th>Gender</th>
//               </tr>
//               {data.map((val, key) => {
//                   return (
//                       <tr key={key}>
//                           <td>{val.name}</td>
//                           <td>{val.age}</td>
//                           <td>{val.gender}</td>
//                       </tr>
//                   )
//               })}
//           </table>
//       </div>
//   );
// }


export default Rank;
