import Button from '../Button'
import styles from './page.module.scss'

type Props = {
  rightButtonLabel: string
  leftButtonLabel: string
  rightButtonClick?: () => void
  leftButtonClick?: () => void
}
export const ButtonGroup = ({
  rightButtonLabel,
  leftButtonLabel,
  rightButtonClick,
  leftButtonClick
}: Props) => {
  return (
    <div className={styles.containerButton}>
      <Button
        type="button"
        label={rightButtonLabel}
        hasClassName={true}
        onClick={rightButtonClick}
      />
      <Button
        type="submit"
        label={leftButtonLabel}
        hasClassName={true}
        onClick={leftButtonClick}
      />
    </div>
  )
}
