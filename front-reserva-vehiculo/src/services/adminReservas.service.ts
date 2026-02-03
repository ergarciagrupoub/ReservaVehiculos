import { api } from '../api';

export const getReservasGlobal = async () => {
  return api('/reservas/historico-global', {
    method: 'GET',
  });
};
