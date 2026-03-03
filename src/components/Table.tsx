import { ReactNode } from 'react';
interface TableProps {
  data: Record<string, ReactNode>[];
}
export default function Table({ data }: TableProps) {
  return (
    <table>
      <tbody>
        {data?.map((row: Record<string, ReactNode>, i: number) => (
          <tr key={i}>
            {Object.values(row).map((cell: ReactNode, j: number) => (
              <td key={j}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}