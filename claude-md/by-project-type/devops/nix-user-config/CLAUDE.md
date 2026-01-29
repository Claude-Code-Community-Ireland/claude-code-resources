# CLAUDE.md - Guidelines for NixOS/nix-darwin Configuration

## Build/Deploy Commands

- Build configuration: `darwin-rebuild build --flake .` (alias: `drb`) # run this yourself to test changes
- Apply configuration: `darwin-rebuild switch --flake .` (alias: `drs`) # ask me to run this instead of running it yourself
- Update flake inputs: `nix flake update` (alias: `flakeup`) # ask me to run this instead of running it yourself

**Note:** Claude Code might be running in a zsh or a fish environment and regardless doesn't have access to fish shell aliases/functions defined in `home/fish.nix`. Always use the expanded commands above (not the aliases) when running commands via the Bash tool.

## Nixpkgs Setup Overview

### Flake Structure

This is a comprehensive nix-darwin + home-manager configuration with the following key components:

**Inputs:**

- `nixpkgs-master`: Latest nixpkgs from master branch
- `nixpkgs-stable`: Stable nixpkgs (24.11-darwin)
- `nixpkgs-unstable`: Unstable nixpkgs (primary package source)
- `nixos-stable`: Stable NixOS (24.11)
- `darwin`: nix-darwin for macOS system management
- `home-manager`: User environment management
- `prefmanager`: macOS preferences management tool

**System Configurations:**

- `notnux6`: Primary macOS configuration (Apple Silicon)
- `bootstrap-x86/bootstrap-arm`: Minimal bootstrap configurations
- `githubCI`: CI-specific configuration for GitHub workflows
- `homeConfigurations.matt`: Linux VM configuration

### Key Features

**Multi-Architecture Support:**

- Apple Silicon (aarch64-darwin) with x86_64 package fallbacks
- Automatic x86 package substitution for packages that don't build on Apple Silicon
- Cross-platform home-manager configuration for Linux VMs

**Package Management:**

- Multiple nixpkgs versions available via overlays (`pkgs-master`, `pkgs-stable`, `pkgs-unstable`)
- Node.js packages managed via `node2nix` in `pkgs/node-packages/`
- Custom overlays for Vim utilities and Lua packages
- Homebrew integration for macOS-specific packages and GUI applications

**System Configuration:**

- macOS defaults management (`darwin/defaults.nix`)
- System-wide packages and environment setup (`darwin/general.nix`)
- Homebrew integration with extensive cask and MAS app management (`darwin/homebrew.nix`)
- User environment via home-manager modules

**Development Environment:**

- Comprehensive development tools (Python, Node.js, Haskell, Lua, etc.)
- Neovim configuration with custom theme and plugins
- Fish shell with Starship prompt
- Git configuration with aliases and GitHub integration

### Directory Structure

- `darwin/`: macOS system configuration modules
- `home/`: home-manager user configuration modules
- `modules/`: Shared modules for both darwin and home-manager
- `overlays/`: Custom nixpkgs overlays
- `pkgs/`: Custom package definitions (node-packages, claude-code)

### Registry Integration

The flake is registered as `my` in the nix registry, allowing:

- `nix run my#<package>` to run packages
- `nix shell my#<shell>` to enter development shells
- `nix build my#<output>` to build specific outputs

## Code Style Guidelines

- **Formatting**: 2-space indentation, reasonable line lengths (<100 chars)
- **Imports**: stdlib first (lib, pkgs, config), then external, local modules last
- **Naming**: camelCase for variables/functions, kebab-case for modules/files
- **Function Pattern**: `{ config, pkgs, lib, ... }: { ... }`
- **Organization**: Use `let ... in ...` for local definitions
- **Vim markers**: Use `{{{` and `}}}` for code folding with descriptive section headers
- **Whitespace**: Spaces around operators, after parameter blocks, empty lines between sections
- **Error Handling**: Use `?` for optional parameters, conditional logic with `optional` function

## Project Structure

- `darwin/`: macOS-specific configuration
- `home/`: home-manager configuration
- `modules/`: shared modules for both systems
- `overlays/`: nixpkgs overlays

## General

- Seek to actually understand what's going on. Don't just hack around a problem by building an overlay. Try to keep the codebase simple, but actually fixing problems at the root.
- **IMPORTANT**: Nix flakes use git to determine what files exist. New files must be `git add`ed before nix will see them, even if they're not committed yet. However, once git is tracking a file, changes to that file don't need to be staged for nix to use them.
