import { HardhatRuntimeEnvironment } from "hardhat/types/runtime"
import { DeployFunction } from "hardhat-deploy/types"
import { networkConfig, developmentChains } from "../helper-hardhat-config"
import verify from "../utils/verify"
//@ts-ignore
import { ethers } from "hardhat"
import { MIN_DELAY } from "../helper-hardhat-config"

const deployTimeLock: DeployFunction = async ({
    //@ts-ignore
    getNamedAccounts,
    //@ts-ignore
    deployments,
    network,
}: HardhatRuntimeEnvironment) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    log("Deploying TimeLock...")

    const timeLock = await deploy("TimeLock", {
        from: deployer,
        args: [MIN_DELAY, [], []],
        log: true,
        waitConfirmations: networkConfig[network.name]?.blockConfirmations || 1,
    })
    log(`TimeLock at ${timeLock.address}`)
}

export default deployTimeLock
