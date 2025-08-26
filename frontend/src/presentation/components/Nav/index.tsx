import { enumsRoutes } from '@/shared/enums/enumsRoutes';
import { ItemNavegation } from '../ItemNavegation';
import styles from './page.module.scss'
export const Nav = () => {

  return (
    <div className={styles.container}>
        <ItemNavegation to={enumsRoutes.APPOINTMENTS}>Realizar Agendamento</ItemNavegation>
        <ItemNavegation to={enumsRoutes.SEARCH_APPOINTMENTS}>Buscar Agendamentos</ItemNavegation>
        <ItemNavegation to={enumsRoutes.SCHEDULE}>Montar Agenda</ItemNavegation>
        <ItemNavegation to={enumsRoutes.PROFILE}>Editar Perfil</ItemNavegation>
        <ItemNavegation to={enumsRoutes.AUTHENTICATION}>Sair</ItemNavegation>
    </div>
  );
};
