import Button from "../Button";
import styles from './page.module.scss'

type Props = {
  rightButtonLabel: string;
  leftButtonLabel: string;
};
export const ButtonGroup = ({ rightButtonLabel, leftButtonLabel }: Props) => {
  return (
    <div className={styles.container}>
      <Button type="submit" label={rightButtonLabel} hasClassName={true}/>
      <Button type="submit" label={leftButtonLabel} hasClassName={true}/>
    </div>
  );
};
