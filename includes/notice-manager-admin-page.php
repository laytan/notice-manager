<?php
// If the user does not have the permission to manage options we die
if ( ! current_user_can( 'manage_options' ) )  {
    wp_die( __( 'You do not have sufficient permissions to access this page.', 'notice-manager' ) );
}

if( isset( $_GET['notice-manager-unban'] ) ) {
    $this->unban( intval( $_GET['notice-manager-unban'] ) );
} else {
$bans = $this->database->get_bans();
ob_start();
?>
<div class="wrap">
    <h1><?php _e( 'Notice Manager', 'notice-manager' ); ?></h1>
    <ul class="notice-manager-banned-notices">
    <hr>
    <?php 
    foreach( $bans as $ban ) :
    ?>
    <li class="notice-manager-banned-notice">
        <p class="notice-manager-notice-text">
            <p>
            <?php _e( 'On', 'notice-manager' ); ?>
            <?= esc_html($ban->time); ?>
            <?php _e( 'You banned:', 'notice-manager' ); ?>
            </p>
            <p>
            <?= esc_html($ban->nice_body); ?>
            </p>
        </p>
        <div class="notice-manager-ban-options">
        <?php
        $url = add_query_arg(
            [
                'action' => 'notice-manager-unban',
                'notice-manager-unban'   => $ban->id,
                'nonce'  => wp_create_nonce('notice-manager-unban'),
            ],
            menu_page_url('notice-manager-page', false)
        );
        ?>
            <a href="<?= $url ?>" class="notice-manager-ban-options-button">
            <?php _e( 'Unban this notice', 'notice-manager' ); ?>
            </a>
        </div>
    </li>
    <hr>
    <?php
    endforeach;
    ?>
    </ul>
</div>
<?php
echo ob_get_clean();
}
?>