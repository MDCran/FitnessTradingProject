import PageWrapper from "src/components/PageWrapper";
import { Table } from 'geist/components';

const Rank = () => (
  <PageWrapper title="Rank">
    {/* <p className="tc f4 fw4 w-70">
      LEADERBOARD
      For testing table
    </p> */}
    
    {/* <table>
      <tr>
        <th></th>
        <th>Company</th>
        <th>Contact</th>
        <th>Country</th>
      </tr>
      <tr>
        <td>Alfreds Futterkiste</td>
        <td>Maria Anders</td>
        <td>Germany</td>
      </tr>
      <tr>
        <td>Centro comercial Moctezuma</td>
        <td>Francisco Chang</td>
        <td>Mexico</td>
      </tr>
    </table> */}

    {/* <html>
      <head>
        <title>Simple HTML Table Example</title>
      </head>
      <body>
        <table border="1">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>City</th>
          </tr>
          <tr>
            <td>1</td>
            <td>Alice</td>
            <td>24</td>
            <td>New York</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Bob</td>
            <td>30</td>
            <td>Los Angeles</td>
          </tr>
          <tr>
            <td>3</td>
            <td>Charlie</td>
            <td>28</td>
            <td>Chicago</td>
          </tr>
          <tr>
            <td>4</td>
            <td>David</td>
            <td>22</td>
            <td>Miami</td>
          </tr>
          <tr>
            <td>5</td>
            <td>Eva</td>
            <td>35</td>
            <td>Atlanta</td>
          </tr>
        </table>
      </body>
    </html>

    td {
      border-bottom: 2px solid green;
    } */}


    <Table>
      <Table.Colgroup>
        <Table.Col className="w-[44%]" />
        <Table.Col className="w-[22%]" />
        <Table.Col className="w-[22%]" />
        <Table.Col className="w-[11%]" />
      </Table.Colgroup>
      <Table.Header>
        <Table.Row>
          <Table.Head>Product</Table.Head>
          <Table.Head>Usage</Table.Head>
          <Table.Head>Price</Table.Head>
          <Table.Head>Charge</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body interactive striped>
          <Table.Row>
            <Table.Cell>1</Table.Cell>
            <Table.Cell>2</Table.Cell>
            <Table.Cell>3</Table.Cell>
            <Table.Cell>4</Table.Cell>
          </Table.Row>
      </Table.Body>
    </Table>

    <p>
      New 2 test
    </p>

  </PageWrapper>
);

export default Rank;
