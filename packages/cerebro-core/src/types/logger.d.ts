export type ConfigType = { type: string; msg: string; label: string; icon: boolean };

export interface Logger {
    clear(): void;

    print(config: Partial<ConfigType> = {});

    critical(message: any, label: string = "", showIcon: boolean = false): string;

    error(message: any, label: string = "", showIcon: boolean = false): string;

    danger(message: any, label: string = "", showIcon: boolean = false): string;

    success(message: any, label: string = "", showIcon: boolean = false): string;

    warning(message: any, label: string = "", showIcon: boolean = false): string;

    info(message: any, label: string = "", showIcon: boolean = false): string;

    debug(message: any, label: string = "", showIcon: boolean = false): string;

    log(message: any, label: string = "", showIcon: boolean = false): string;

    status(message: any, label: string = "", showIcon: boolean = false): string;

    notice(message: any, label: string = "", showIcon: boolean = false): string;

    note(message: any, label: string = "", showIcon: boolean = false): string;

    processing(message: string): void;

    dd(...data);

    dump(...data);

    line(message: string = ""): string;

    center(message: any, fillText: string = " "): string;
}
