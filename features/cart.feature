Feature: Cart operations

  Scenario: Add one item to cart (should pass)
    Given I open the login page
    When I login with "standard_user" and "secret_sauce"
    And I add the first product to the cart
    Then the cart badge should show "1"

  Scenario: Badge mismatch (demo failing)
    Given I open the login page
    When I login with "standard_user" and "secret_sauce"
    And I add the first product to the cart
    Then the cart badge should show "2"  # intentionally incorrect to produce a failing test

