async function executeExistingBinary(binUrl) {
    console.log("[1] Initiating fetch...");
    const response = await fetch(binUrl);
    
    if (!response.ok) {
        console.error(`[-] Fetch failed with HTTP status: ${response.status}`);
        return;
    }

    const arrayBuffer = await response.arrayBuffer();
    const payloadBytes = new Uint8Array(arrayBuffer);
    console.log(`[2] Downloaded binary successfully (${payloadBytes.length} bytes).`);

    // Verify your kernel read/write primitive is alive before resolving addresses
    console.log("[3] Resolving RAM buffer address via exploit primitive...");
    const payloadAddress = getExploitBufferAddress(payloadBytes);
    
    if (!payloadAddress || payloadAddress === 0x0) {
        console.error("[-] Failed to get RAM address from exploit primitive!");
        return;
    }
    console.log(`[+] Buffer mapped at RAM: 0x${payloadAddress.toString(16)}`);

    // Attempt control flow handoff
    console.log("[4] Executing in-memory Mach-O loader...");
    runInMemoryMachOLoader(payloadAddress, payloadBytes.length);
}

// Trigger after Kexploit read/write is confirmed
executeExistingBinary('./Dopamine_payload.bin');
