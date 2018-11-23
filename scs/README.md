# Sberbank SCS contest

## Task
See @scs_zn2018_bot

WORKSHOP SCHEDULE
 
20.11.2018: 12:15, 14:30, 16:45 
21.11.2018: 11:40, 13:40, 16:35
 
CONTEST RULES
 
1) Create EMV application 
2) Upload it to the card 
3) Buy T-short or USB-flash via POS (one item per hands)
 
PS: chip writer and blank card provided on our booth
  
CARD NUMBER: 4173 9881 5901 894*
 
USEFUL LINKS
 
OpenEMV - https://github.com/JavaCardOS/OpenEMV   
JCIDE - https://javacardos.com/tools   
PyAPDUTool - https://javacardos.com/tools

**DAY 2: Add name from your badge as cardholder name**

## Solution
First thing: find last digit of card number: 4173988159018943 (Luhn check)

Useful resource: https://paymentcardtools.com

Step 1: Change Application ID to AID which is already known to terminal
See https://www.eftlab.co.uk/index.php/site-map/knowledge-base/211-emv-aid-rid-pix

I used `A0000000031010` -- that's VISA Debit/Credit (Classic)

Step 2: Change card number aka PAN
Step 3: Add another tag -- Cardholder name

Step 4: Build cap and flash it to the card.

Step 5: Pay. Pincode is 1234:
```
pin.update(new byte[] { (byte) 0x12, (byte) 0x34 }, (short) 0, (byte) 2);
```

Final solution is patch for OpenEMV.
Also, PaHUEllo IbanuZZo made it without windows machine -- that's way more interesting :P