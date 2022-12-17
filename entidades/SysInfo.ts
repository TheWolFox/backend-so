import ProcessInfo from './ProcessInfo';

export default interface SysInfo {
  uptime: number;
  carga_5: number;
  carga_10: number;
  carga_15: number;
  memoria_total: number;
  memoria_livre: number;
  memoria_usada: number;
  memoria_buffers: number;
  swap_total: number;
  swap_livre: number;
  swap_usado: number;
  pct_cpu_usuario: number;
  pct_cpu_sistema: number;
  pct_cpu_inativo: number;
  pct_cpu_io: number;
  pct_cpu_hi: number;
  pct_cpu_si: number;
  tarefas_totais: number;
  tarefas_executando: number;
  tarefas_dormindo: number;
  tarefas_paradas: number;
  tarefas_zumbi: number;
  processos: ProcessInfo[];
}