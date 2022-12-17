export default interface ProcessInfo {
    pid: number;
    usuario: String;
    prioridade: number;
    nice: number;
    memoria_virtual: number;
    memoria_usada: number;
    memoria_compartilhada: number;
    estado: String;
    pct_cpu: number;
    pct_mem: number;
    tempo: number;
    programa: String;
  }