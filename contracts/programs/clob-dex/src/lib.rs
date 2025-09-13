use anchor_lang::prelude::*;

declare_id!("BeD2ptKNis326cLsk1SNT9KamDdDdM69xVk9UrStTY74"); // id шник

#[program]
pub mod clob_dex {
    use super::*;

    // Создание рынка
    pub fn init_market(ctx: Context<InitMarket>, tick_size: u64) -> Result<()> {
        let market = &mut ctx.accounts.market;
        market.base_mint = ctx.accounts.base_mint.key();
        market.quote_mint = ctx.accounts.quote_mint.key();
        market.tick_size = tick_size;
        Ok(())
    }

    // Создание лимит-ордера (PDA); side: 0 = Buy, 1 = Sell
    pub fn place_limit_order(
        ctx: Context<PlaceLimitOrder>,
        side: u8,
        price: u64,
        quantity: u64,
        client_order_id: u64,
    ) -> Result<()> {
        require!(side <= 1, DexError::InvalidSide);
        require!(price > 0, DexError::InvalidPrice);
        require!(quantity > 0, DexError::InvalidQuantity);

        let order = &mut ctx.accounts.order;
        order.market = ctx.accounts.market.key();
        order.owner = ctx.accounts.owner.key();
        order.side = if side == 0 { Side::Buy } else { Side::Sell };
        order.price = price;
        order.quantity = quantity;
        order.remaining = quantity;
        order.client_order_id = client_order_id;
        order.is_active = true;
        order.bump = ctx.bumps.order;
        order.created_at = Clock::get()?.unix_timestamp;

        Ok(())
    }

    // Отмена ордера, владелец должен совпадать
    pub fn cancel_order(ctx: Context<CancelOrder>) -> Result<()> {
        let order = &mut ctx.accounts.order;

        require!(order.is_active, DexError::OrderNotActive);
        require_keys_eq!(order.owner, ctx.accounts.owner.key(), DexError::Unauthorized);

        order.is_active = false;
        Ok(())
    }
}

/* ---------------------- Accounts & Data ---------------------- */

#[derive(Accounts)]
pub struct InitMarket<'info> {
    // рынок создаётся ключом, который сгенерит клиент
    #[account(init, payer = authority, space = 8 + Market::LEN)]
    pub market: Account<'info, Market>,

    /// сохраняем онли Pubkey
    pub base_mint: UncheckedAccount<'info>,
    /// сохраняем онли Pubkey
    pub quote_mint: UncheckedAccount<'info>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[account]
pub struct Market {
    pub base_mint: Pubkey,
    pub quote_mint: Pubkey,
    pub tick_size: u64,
}
impl Market {
    pub const LEN: usize = 32 + 32 + 8;
}

#[derive(Accounts)]
#[instruction(side: u8, price: u64, quantity: u64, client_order_id: u64)]
pub struct PlaceLimitOrder<'info> {
    #[account(mut)]
    pub market: Account<'info, Market>,

    // PDA: ["order", market, owner, client_order_id_le]
    #[account(
        init,
        payer = owner,
        space = 8 + Order::LEN,
        seeds = [
            b"order",
            market.key().as_ref(),
            owner.key().as_ref(),
            &client_order_id.to_le_bytes()
        ],
        bump
    )]
    pub order: Account<'info, Order>,

    #[account(mut)]
    pub owner: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CancelOrder<'info> {
    // owner гарантирует, что поле order.owner указывает на owner
    #[account(mut, has_one = owner)]
    pub order: Account<'info, Order>,

    #[account(mut)]
    pub owner: Signer<'info>,
}

#[account]
pub struct Order {
    pub market: Pubkey,
    pub owner: Pubkey,
    pub side: Side,          // 1 byte
    pub price: u64,
    pub quantity: u64,
    pub remaining: u64,
    pub client_order_id: u64,
    pub is_active: bool,     // 1 byte
    pub bump: u8,            // 1 byte
    pub created_at: i64,
}
impl Order {
    // 32+32 +1 +8+8+8+8 +1 +1 +8
    pub const LEN: usize = 32 + 32 + 1 + 8 + 8 + 8 + 8 + 1 + 1 + 8;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum Side {
    Buy = 0,
    Sell = 1,
}

#[error_code]
pub enum DexError {
    #[msg("Invalid side")]
    InvalidSide,
    #[msg("Invalid price")]
    InvalidPrice,
    #[msg("Invalid quantity")]
    InvalidQuantity,
    #[msg("Order is not active")]
    OrderNotActive,
    #[msg("Unauthorized cancel attempt")]
    Unauthorized,
}
