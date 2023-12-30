module kiosk_tone::kiosk_tone {
    use sui::transfer;
    use sui::object::{Self, UID};
    use sui::tx_context::{Self,TxContext};
    use std::string::{utf8, String};
    use sui::kiosk::{Self, Kiosk, KioskOwnerCap};

    use sui::package;
    use sui::display;

    struct Monbob has key, store {
        id: UID,
        gene: u64,
        image_url: String,
    }

    struct KIOSK_TONE has drop {}

    fun init(otw: KIOSK_TONE, ctx: &mut TxContext) {
        let keys = vector[
            utf8(b"gene"),
            utf8(b"image_url"),
        ];

        let values = vector[
            utf8(b"Monbob{gene}"),
            utf8(b"ipfs://{image_url}"),
        ];

        let publisher = package::claim(otw, ctx);

        let display = display::new_with_fields<Monbob>(
            &publisher, keys, values, ctx
        );

        display::update_version(&mut display);

        transfer::public_transfer(publisher, tx_context::sender(ctx));
        transfer::public_transfer(display, tx_context::sender(ctx));

    }

    public entry fun mint_monbob_to_sender(
        gene: u64, image_url: String, ctx: &mut TxContext
    ) {
        let monbob = Monbob {
            id: object::new(ctx),
            image_url,
            gene,
        };

        transfer::public_transfer(monbob, tx_context::sender(ctx));
    }

    public entry fun mint_monbob_to_kiosk(
        gene: u64, image_url: String, kiosk: &mut Kiosk, cap: &KioskOwnerCap, ctx: &mut TxContext
    ) {
        let monbob = Monbob {
            id: object::new(ctx),
            image_url,
            gene,
        };

        kiosk::place(kiosk, cap, monbob);
    }

    public entry fun transfer(
        monbob: Monbob, recipient: address, _: &mut TxContext
    ) {
        transfer::public_transfer(monbob, recipient)
    }

    public fun burn(monbob: Monbob, _: &mut TxContext) {
        let Monbob { id, gene: _, image_url: _ } = monbob;
        object::delete(id)
    }
}