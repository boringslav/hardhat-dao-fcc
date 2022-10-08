import { ethers, network } from "hardhat"
import * as fs from "fs"
import {
    NEW_STORE_VALUE,
    FUNC,
    PROPOSAL_DESCRIPTION,
    VOTING_DELAY,
    PROPOSALS_FILE,
    developmentChains,
} from "../helper-hardhat-config"
import { moveBlocks } from "../utils/move-blocks"

export const propose = async (args: any[], functionToCall: string, proposalDescription: string) => {
    const governor = await ethers.getContract("GovernorContract")
    const box = await ethers.getContract("Box")

    const encodedFunctionCall = box.interface.encodeFunctionData(functionToCall, args)
    console.log(`Proposing ${functionToCall} on ${box.address} with ${args}`)
    console.log(`Proposal Description:\n  ${proposalDescription}`)

    const proposeTx = await governor.propose(
        [box.address],
        [0],
        [encodedFunctionCall],
        proposalDescription
    )

    const proposeReceipt = await proposeTx.wait(1)

    if (developmentChains.includes(network.name)) {
        await moveBlocks(VOTING_DELAY + 1)
    }
    const proposalId = proposeReceipt.events[0].args.proposalId

    let proposals = JSON.parse(fs.readFileSync(PROPOSALS_FILE, "utf8"))
    proposals[network.config.chainId!.toString()].push(proposalId.toString())
    fs.writeFileSync(PROPOSALS_FILE, JSON.stringify(proposals))
}

propose([NEW_STORE_VALUE], FUNC, PROPOSAL_DESCRIPTION)
    .then(() => process.exit(0))
    .catch((e) => {
        console.log(e)
        process.exit(1)
    })
