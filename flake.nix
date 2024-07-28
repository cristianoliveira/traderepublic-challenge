{
  description = "New flake";
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
        devShells.default = pkgs.mkShell {
          packages = with pkgs; [
            nodejs_20 # 20

            websocat # Websocket client

            # Image building 
            docker
            docker-compose

            # Infra
            awscli
            tenv # Terraform env manager (needed for macOs arm64 M1/M2/etc)
          ];
        };
    });
}
