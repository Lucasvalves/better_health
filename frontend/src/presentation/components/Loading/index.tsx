import { ImSpinner8 } from 'react-icons/im';
import style from './page.module.scss';

type Props = {
  size?: number;
  className?: string;
};

export default function Loading({ size = 15, className }: Props) {
  return (
    <ImSpinner8 
      className={`${style.spinner} ${className || ''}`} 
      size={size} 
    />
  );
}