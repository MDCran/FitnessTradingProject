import { Table } from 'geist/components';
import type { JSX } from 'react';

import PageWrapper from "src/components/PageWrapper";


const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  maximumFractionDigits: 2,
  currency: 'usd',
});

function formatCurrency(amount: number): string {
  return formatter.format(amount);
}

const items = [
  {
    product: 'Brake Pads Set',
    usage: '100 sets',
    price: '$50 per set',
    charge: 5000,
  },
  {
    product: 'Oil Filters',
    usage: '200 filters',
    price: '$10 per filter',
    charge: 2000,
  },
  {
    product: 'Car Batteries',
    usage: '50 batteries',
    price: '$100 per battery',
    charge: 5000,
  },
  {
    product: 'Headlight Bulbs',
    usage: '300 bulbs',
    price: '$15 per bulb',
    charge: 4500,
  },
  {
    product: 'Windshield Wipers',
    usage: '250 pairs',
    price: '$20 per pair',
    charge: 5000,
  },
  {
    product: 'Spark Plugs',
    usage: '500 sets',
    price: '$5 per set',
    charge: 2500,
  },
];

export function Component(): JSX.Element {
  return (
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
        {items.map((item) => (
          <Table.Row key={item.product}>
            <Table.Cell>{item.product}</Table.Cell>
            <Table.Cell>{item.usage}</Table.Cell>
            <Table.Cell>{item.price}</Table.Cell>
            <Table.Cell>{formatCurrency(item.charge)}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
      <Table.Footer>
        <Table.Row>
          <Table.Cell className="text-gray-1000 font-medium" colSpan={3}>
            Subtotal
          </Table.Cell>
          <Table.Cell className="text-gray-1000 font-medium">
            {formatCurrency(items.reduce((sum, val) => sum + val.charge, 0))}
          </Table.Cell>
        </Table.Row>
      </Table.Footer>
    </Table>
  );
}

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

    <p>
      rip
    </p>

  </PageWrapper>
);

export default Rank;
