import { ChildProcess, exec, execFile, fork, spawn } from "child_process";
import DiskInfo from "./entidades/DiskInfo";
import ProcessInfo from "./entidades/ProcessInfo";
import SysInfo from "./entidades/SysInfo";

export class Commands{
    
    execProcess: ChildProcess;

    constructor(){
        this.execProcess;
    }

    runCommand(comm: string):Promise<string>{
        let out: string;
        this.execProcess = exec(comm);

         return this.streamToString(this.execProcess.stdout).then(out => {
            return out;
        })
        
    }

    getCpuInfo(){
        return this.runCommand('cat /proc/cpuinfo').then(out =>{
            const linhas = out.split('\n');

            const model = (linhas[4].split(':'))[1].trim();
            const nucleos =+ (linhas[12].split(':'))[1].trim();
            const threads =+ (linhas[10].split(':'))[1].trim();


            return {
                num_nucleos: nucleos,
                num_threads: threads,
                modelo: model
            };
        })
    }

    getMemInfo(){
        return this.runCommand('cat /proc/meminfo').then(out =>{
            const linhas = out.split('\n');

            const mem_total = Number (linhas[0]
                .toLowerCase()
                .replace('memtotal:', '')
                .replace('kb', '')
                .trim());

            const mem_livre = Number (linhas[1]
                .toLowerCase()
                .replace('memfree:', '')
                .replace('kb', '')
                .trim());

            const mem_cache = Number (linhas[4]
                .toLowerCase()
                .replace('cached:', '')
                .replace('kb', '')
                .trim());

            const mem_buffers = Number (linhas[3]
                .toLowerCase()
                .replace('buffers:', '')
                .replace('kb', '')
                .trim());
            

            const mem_swap_total = Number (linhas[14]
                .toLowerCase()
                .replace('swaptotal:', '')
                .replace('kb', '')
                .trim());

            const mem_swap_livre = Number (linhas[15]
                .toLowerCase()
                .replace('swapfree:', '')
                .replace('kb', '')
                .trim());

            return {
                memoria_total: mem_total,
                memoria_livre: mem_livre,
                memoria_cache: mem_cache,
                memoria_buffers: mem_buffers,
                memoria_swap_total: mem_swap_total,
                memoria_swap_livre: mem_swap_livre,
            };
        })
    }

    getDiskInfo(){
        return this.runCommand('df -la').then(out =>{
            let teste: DiskInfo[] = [];
            const linhas = out.split('\n');
            const discos = linhas.filter((linha) => {
                return linha.indexOf("none") !== 0;
            }).slice(1).map((disco) => {
                const [
                    filesystem,
                    blocks_1k,
                    used,
                    available,
                    perc_use,
                    mounted_on,
                ] = disco.trim().replace(/  +/g, ' ').split(' ');
                
                teste.push({
                    origem_disco: filesystem,
                    numero_blocos_1k: Number(blocks_1k),
                    espaco_usado: Number(used),
                    espaco_disponivel: Number(available),
                    porcentagem_usada: Number(perc_use?.replace('%', '')),
                    lugar_montado: mounted_on,
                }) as unknown as DiskInfo;
            });
            return teste;
        })
    }

    getSystemInfo(){
        return this.runCommand('top -b -n1').then(out =>{
            let process: ProcessInfo[] =[];
            let top: SysInfo;
            const linhas = out.split('\n');

            const info = linhas[0].split('users,').map((i) =>
            i
                .replace('top - ', '')
                .replace('load average: ', '')
                .split(',')
                .map((e) => e.trim())
            );

            const [load5, load10, load15] = info[1].map((l) => Number(l));
            const num_users = Number(info[0].length == 2 ? info[0][1] : info[0][2]);

            let uptime = 0;
            if (info[0].length == 2) {
            // Caso uptime < 1 dia
            uptime =
                Number(info[0][0].split('up')[1].trim().split(':')[0]) * 60 * 60 + // Conversão de horas para segundos
                Number(info[0][0].split('up')[1].trim().split(':')[1]) * 60; // Conversão de minutos para segundos
            } else {
            // Caso uptime >= 1 dia
            uptime =
                Number(info[0][0].split('up')[1].trim().split(' ')[0]) * 24 * 60 * 60 + // Conversão de dias para segundos
                Number(info[0][1].trim().split(':')[0]) * 60 * 60 + // Conversão de horas para segundos
                Number(info[0][1].trim().split(':')[1]) * 60; // Conversão de minutos para segundos
            }

            const [t_total, t_running, t_sleeping, t_stopped, t_zombie] = linhas[1]
            .toLowerCase()
            .replace('tasks:', '')
            .split(',')
            .map((i) => Number(i.trim().split(' ')[0]));

            const cpu = linhas[2]
            .toLowerCase()
            .replace('%cpu(s):', '')
            .split(',')
            .map((i) => Number(i.trim().split(' ')[0]));

            const ram = linhas[3]
            .toLowerCase()
            .replace('mib mem :', '')
            .split(',')
            .map((i) => Number(i.trim().split(' ')[0]));

            const swap = linhas[4]
            .toLowerCase()
            .replace('mib swap:', '')
            .split(',')
            .map((i) => Number(i.trim().split(' ')[0]));

            const mem_available = Number(
            linhas[4].split('used.')[1].trim().split(' ')[0]
            );

            const processos = linhas.slice(7).map((proc) => {
            const [
                pid,
                user,
                pr,
                ni,
                virt,
                res,
                shr,
                s,
                pct_cpu,
                pct_mem,
                time,
                command,
            ] = proc.trim().replace(/  +/g, ' ').split(' ');
            process.push({
                    pid: Number(pid),
                    usuario: user,
                    prioridade: Number(pr),
                    nice: Number(ni),
                    memoria_virtual: Number(virt),
                    memoria_usada: Number(res),
                    memoria_compartilhada: Number(shr),
                    estado: s,
                    pct_cpu: Number(pct_cpu),
                    pct_mem: Number(pct_mem),
                    tempo: Number(time?.split(':')[0]) * 60 + Number(time?.split(':')[1]),
                    programa: command,
                }) as unknown as ProcessInfo;
            });

            top = {
                uptime,
                carga_5: load5,
                carga_10: load10,
                carga_15: load15,
                memoria_total: ram[0],
                memoria_livre: ram[1],
                memoria_usada: ram[2],
                memoria_buffers: ram[3],
                swap_total: swap[0],
                swap_livre: swap[1],
                swap_usado: swap[2],
                pct_cpu_usuario: cpu[0],
                pct_cpu_sistema: cpu[1],
                pct_cpu_inativo: cpu[3],
                pct_cpu_io: cpu[4],
                pct_cpu_hi: cpu[5],
                pct_cpu_si: cpu[6],
                tarefas_totais: t_total,
                tarefas_executando: t_running,
                tarefas_dormindo: t_sleeping,
                tarefas_paradas: t_stopped,
                tarefas_zumbi: t_zombie,
                processos: process,
            } as unknown as SysInfo;
            
            return top;
        })
    }

    getCommand(command){
        return this.runCommand(command.toString()).then(out => {
            return out;
        })
    }

    streamToString (stream):Promise<string> {
        const chunks = [];
        return new Promise((resolve, reject) => {
          stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
          stream.on('error', (err) => reject(err));
          stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
        })
    }
      
    
}