## NFC Box by Pavel Zhovner

There are cards, all have initial balance (300-400Y?..)
You can buy something in bar for 150Y
You can open the box for 750Y
You can get pn532, and there's one spare proxmarkv3

Everything was already covered in depth by Pavel in https://t.me/nfc_box, so here's a very brief solution summary:

- Use proxmark to sniff communication
- Find out it reads sector 0x1c with key A, get that key with mfkey64
- Find out that it reads sector 0x20 with key B just after that & you can't extract key from nested auth that easily
- See v0s opening the box :D
- Find key B for sector 0x20 with Hardnested attack implemented in `libnfc_crypto1_crack`
- Read that sector for different cards (see hexdump)
- Try changing random bytes to figure out critical ones
- Understand the pattern:  
`BB BB CC RR RR CC CC CC CC CC CC CC CC CC SS SS`, where:
	- BB: balance (i.e. 00db => 219)
	- CC: constant, doesn't matter
	- RR: random, doesn't matter but changes
	- SS: Checksum/verification/signature/whatever
- SS only depends on BB, doesn't depend on card UID or other bytes
- Try CRC16, fail
- Try CRC16 with all possible polinoms/inital states, fail
- Give up
- Try CRC16 used in the ISO 14443 A (thx for hint), use zhovner's calc :P
- Write new balance -- 2087Y (2087-750 = 1337)
- Open the box, get day 2 prize (chameleon mini + wrong size tshirt :D)