import {HTMLAttributes, PropsWithChildren} from 'react';

export default function ChartTitle(
  props: PropsWithChildren<HTMLAttributes<HTMLDivElement>>,
) {
  return <span style={{fontSize: 18}}>{props.children}</span>;
}
