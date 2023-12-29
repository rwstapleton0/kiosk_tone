module kiosk_tone::kiosk_tone {
    use sui::transfer;
    use sui::object::{Self, UID, ID};
    use sui::tx_context::{Self,TxContext};
    use sui::url::{Self, Url};
    use sui::event;
    use sui::kiosk::{Self, Kiosk, KioskOwnerCap};

    struct Monbob has key, store {
        id: UID,
        gene: u64,
        url: Url,
    }

    struct MonbobMinted has copy, drop {
        object_id: ID,
        creator: address,
        gene: u64
    }

    public fun url(nft: &Monbob): &Url {
        &nft.url
    }

    public entry fun mint_monbob_to_sender(
        gene: u64, url: vector<u8>, ctx: &mut TxContext
    ) {

        let monbob = Monbob {
            id: object::new(ctx),
            url: url::new_unsafe_from_bytes(url),
            gene
        };

        event::emit(MonbobMinted {
            object_id: object::id(&monbob),
            creator: tx_context::sender(ctx),
            gene: gene,
        });

        transfer::public_transfer(monbob, tx_context::sender(ctx));
    }

    public entry fun mint_monbob_to_kiosk(
        gene: u64, url: vector<u8>, kiosk: &mut Kiosk, cap: &KioskOwnerCap, ctx: &mut TxContext
    ) {

        let monbob = Monbob {
            id: object::new(ctx),
            url: url::new_unsafe_from_bytes(url),
            gene
        };

        event::emit(MonbobMinted {
            object_id: object::id(&monbob),
            creator: tx_context::sender(ctx),
            gene: gene,
        });

        kiosk::place(kiosk, cap, monbob);
    }

    public entry fun update_url(
        monbob: &mut Monbob, url: vector<u8>, _: &mut TxContext
    ) {
        monbob.url = url::new_unsafe_from_bytes(url);
    }

    public entry fun transfer(
        monbob: Monbob, recipient: address, _: &mut TxContext
    ) {
        transfer::public_transfer(monbob, recipient)
    }
}