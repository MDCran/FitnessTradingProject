import PageWrapper from "src/components/PageWrapper";
import { Table } from 'geist/components';


const Rank = () => (
  <PageWrapper title="Rank">
    <p className="tc f4 fw4 w-70">
      LEADERBOARD
      For testing
    </p>

    <Table>
      <Table.Header>
        <Table.Row>
          <Table.Head>Col 1</Table.Head>
          <Table.Head>Col 2</Table.Head>
          <Table.Head>Col 3</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell>Value 1.1</Table.Cell>
          <Table.Cell>Value 1.2</Table.Cell>
          <Table.Cell>Value 1.3</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Value 2.1</Table.Cell>
          <Table.Cell>Value 2.2</Table.Cell>
          <Table.Cell>Value 2.3</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Value 3.1</Table.Cell>
          <Table.Cell>Value 3.2</Table.Cell>
          <Table.Cell>Value 3.3</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>

  </PageWrapper>
);

export default Rank;
