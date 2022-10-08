import * as fs from "fs"
import { PROPOSALS_FILE, developmentChains, VOTING_PERIOD } from "../helper-hardhat-config"
import { ethers, network } from "hardhat"
import { moveBlocks } from "../utils/move-blocks"

const index = 0
;(async (proposalIndex: number) => {
    const proposals = JSON.parse(fs.readFileSync(PROPOSALS_FILE, "utf8"))
    const proposalId = proposals[network.config.chainId!][proposalIndex]
    //0 = Against, 1 = For, 2 = Abstain
    const voteWay = 1
    const reason = "I like this idea"
    const governor = await ethers.getContract("GovernorContract")
    const voteTxReceipt = await governor.castVoteWithReason(proposalId, voteWay, reason)
    await voteTxReceipt.wait(1)

    const proposalState = await governor.state(proposalId)
    console.log(`Current Proposal State: ${proposalState}`)

    if (developmentChains.includes(network.name)) {
        await moveBlocks(VOTING_PERIOD + 1)
    }
})(index)
    .then(() => process.exit(0))
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
