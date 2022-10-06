import { HardhatRuntimeEnvironment } from "hardhat/types/runtime"
import { DeployFunction } from "hardhat-deploy/types"
import {
    VOTING_DELAY,
    VOTING_PERIOD,
    QUORUM_PERCENTAGE,
    networkConfig,
} from "../helper-hardhat-config"

const deployGovernorContract: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    //@ts-ignore
    const { getNamedAccounts, deployments, network } = hre
    const { deploy, log, get } = deployments
    const { deployer } = await getNamedAccounts()
    const governanceToken = await get("GovernanceToken")
    const timeLock = await get("TimeLock")

    log("Deploying Governor...")

    const governorContract = await deploy("GovernorContract", {
        from: deployer,
        args: [
            governanceToken.address,
            timeLock.address,
            VOTING_DELAY,
            VOTING_PERIOD,
            QUORUM_PERCENTAGE,
        ],
        log: true,
        waitConfirmations: networkConfig[network.name]?.blockConfirmations || 1,
    })
}
export default deployGovernorContract
