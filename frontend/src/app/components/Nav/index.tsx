import { ItemNavegation } from '../ItemNavegation';
import {ROUTES} from '../../paths'
import styles from './page.module.scss'
export const Nav = () => {

  return (
    <div className={styles.container}>
        <ItemNavegation to={ROUTES.APPOINTMENTS}>Realizar Agendamento</ItemNavegation>
        <ItemNavegation to={ROUTES.APPOINTMENTS}>Buscar Agendamentos</ItemNavegation>
        <ItemNavegation to={ROUTES.SCHEDULE}>Montar Agenda</ItemNavegation>
        <ItemNavegation to={ROUTES.PROFILE}>Editar Perfil</ItemNavegation>
        <ItemNavegation to={ROUTES.LOGOUT}>Sair</ItemNavegation>
    </div>
  );
};
