export const BASH_LOCATION = "~/.bashrc";
export const FISH_LOCATION = "~/.config/fish/config.fish";
export const ZSH_LOCATION = process.env.ZDOTDIR ? `${process.env.ZDOTDIR}/.zshrc` : "~/.zshrc";
export const COMPLETION_DIR = "~/.config/cerebro";
export const CEREBRO_SCRIPT_NAME = "__cerebro";

export const SHELL_LOCATIONS = {
    bash: "~/.bashrc",
    zsh: "~/.zshrc",
    fish: "~/.config/fish/config.fish",
};
