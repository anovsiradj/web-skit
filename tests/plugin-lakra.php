<?php

require __DIR__ . '/test_config.php';

$cutter('script', function () use ($count) { ?>
	<script src="../plugins/lakra.js?<?= $count ?>"></script>

	<script>
		const app = new Lakra('#widget', {
			users: [{
				username: 'User 1',
				password: '123456',
			}],
			form: {
				username: '',
				password: '',
			},
			activeUser: null,
			createOrUpdateUser(scope, e) {
				e.preventDefault(); // Prevent form submission
				if (this.activeUser) {
					// Update existing user
					this.activeUser.username = this.form.username;
					this.activeUser.password = this.form.password;
					this.activeUser = null;
				} else {
					// Add new user
					this.users.push({
						username: this.form.username,
						password: this.form.password
					});
				}
				// Reset form
				this.form.username = '';
				this.form.password = '';
			},
			editUser(scope) {
				const user = scope.user;
				this.activeUser = user;
				this.form.username = user.username;
				this.form.password = user.password;
			},
			deleteUser(scope) {
				const user = scope.user;
				// Since we are replacing the array, reactivity should handle it
				this.users = this.users.filter(u => u !== user);
			}
		});
	</script>
<?php });

$cutter('content', function () { ?>

	<div id="widget">
		<form data-$attach="submit" data-$handle="createOrUpdateUser">
			<input name="username" data-$bind="form.username" placeholder="Username">
			<input name="password" data-$bind="form.password" placeholder="Password">
			<button type="submit">save</button>
		</form>

		<ul>
			<li data-$each="users" data-$iden="user">
				<span data-$text="user.username"></span>
				<span data-$html="user.password"></span>
				<button type="button" data-$attach="click" data-$handle="editUser">Edit</button>
				<button type="button" data-$attach="click" data-$handle="deleteUser">×</button>
			</li>
		</ul>
	</div>
<?php });

$cutter->render();
