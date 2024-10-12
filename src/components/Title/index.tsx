import { Icon } from '../Icon/Icon';

type TitleProps = {
  title: string;
};

export default function Title({ title }: TitleProps) {
  return (
    <h3 className="flex items-baseline font-medium text-lg md:items-center">
      <span className="inline-block align-middle text-blue-600">
        <Icon name="blueCircle" color="currentColor" height="0.75rem" />
      </span>
      <span>{title}</span>
    </h3>
  );
}
