{
  # NOTE: If you are not familiar with nix and NIxOS, you can skip this file
  # and just use normal package managers like brew, apt, etc. I just left this
  # file here for me to avoid having to install a bunch of packages manually.
  #
  # If you are interested in learning more about nix, you can check out
  # https://nixos.org/ and https://nixos.wiki/wiki/Nix_Expression_Language
  # It pairs super well with direnv (https://direnv.net/)
  description = "Tradewishes's dev environment";
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs";
    utils.url = "github:numtide/flake-utils";
  };
  outputs = { self, nixpkgs, utils }: 
    utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { 
          inherit system;
          config.allowUnfree = true; # For terraform
        };
      in {
        devShells.default = with pkgs; mkShell {
          packages =  [
            nodejs_20 # 20

            websocat # Websocket client

            # Image building 
            docker
            docker-compose

            # Infra
            awscli
            tenv # Terraform env manager (needed for macOs arm64 M1/M2/etc)

            playwright
          ];

          shellHook = ''
            export PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=true
          '';
        };
    });
}
