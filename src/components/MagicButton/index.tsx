import { mustBeBoolean } from '@/helpers';
import { Button, type ButtonProps, Spinner } from '@radix-ui/themes';

type Props = ButtonProps & {
  className?: string;
  loading?: boolean;
  text: string;
};

const MagicButton = (props: Props) => {
  return (
    <Button
      {...props}
      size={'3'}
      style={{ borderRadius: 20, fontFamily: 'Unbounded, sans-serif' }}
      className={`rounded-md bg-blue-500 p-2 text-white hover:bg-blue-600 px-5 ${props.className} cursor-pointer`}
    >
      <Spinner size={'3'} loading={mustBeBoolean(props.loading)}>
        {props.text}
      </Spinner>
    </Button>
  );
};

export default MagicButton;
